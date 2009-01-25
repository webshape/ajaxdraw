#!/usr/bin/perl

use strict;
use warnings;

use CGI qw( :standard );

print header({-type => 'text/plain'});

my $f = param('file');
while (<$f>) {
    print;
}
